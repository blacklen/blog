import React, { Component } from 'react'
import { isAuthenticate } from '../auth'
import { Redirect, Link } from 'react-router-dom';
import { getUser } from './apiUser';
import DefaultAvatar from "../images/avatar.png"
import DeleteProfile from './DeleteProfile';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';
import { getPostByUser } from '../post/apiPost'

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            user: { following: [], follower: [] },
            redirectToSignin: false,
            following: false,
            posts: []
        }
    }

    componentDidMount() {
        const userId = this.props.match.params.userId;
        const token = isAuthenticate().token;
        getUser(userId, token).then(data => {
            if (!data || data.err) this.setState({ redirectToSignin: true })
            else {
                let following = this.checkFollow(data);
                this.setState({ user: data, following })
                this.loadPosts(data._id)
            }
        })
    }

    loadPosts = userId => {
        const token = isAuthenticate().token;

        getPostByUser(userId, token).then(data => {
            if (data.err) console.log(data.err)
            this.setState({ posts: data })
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.userId !== this.props.match.params.userId) {
            const userId = nextProps.match.params.userId;
            const token = isAuthenticate().token;
            getUser(userId, token).then(data => {
                if (!data || data.err) this.setState({ redirectToSignin: true })
                else {
                    let following = this.checkFollow(data);
                    this.setState({ user: data, following }
                    )
                }
            })
        }
    }

    checkFollow = user => {
        const jwt = isAuthenticate();
        const match = user.followers.find(follower => {
            return follower._id == jwt.user._id;
        })
        return match
    }

    onFollowButtonClick = callApi => {
        const token = isAuthenticate().token;
        const followId = this.props.match.params.userId;
        const userId = isAuthenticate().user._id;
        callApi(userId, token, followId)
            .then(data => {
                if (data.err) console.log(data.err);
                else this.setState({ user: data, following: !this.state.following })
            })
    }

    onUnFollowButtonClick = callApi => {
        const token = isAuthenticate().token;
        const unfollowId = this.props.match.params.userId;
        const userId = isAuthenticate().user._id;
        callApi(userId, token, unfollowId)
            .then(data => {
                if (data.err) console.log(data.err);
                else this.setState({ user: data, following: !this.state.following })
            })
    }

    render() {
        const { user, redirectToSignin, following, posts } = this.state;
        if (redirectToSignin) return <Redirect to="/signin" />;

        return (
            <div className="container">
                {!user.name || !posts.length ? (<div className="jumbotron text-center"><h2>Loading...</h2></div>)
                    : (
                        <>
                            <h2 className="mt-5 mb-5">Profile</h2>
                            <div className="row">
                                <div className="col-md-4">
                                    <img
                                        className="card-img-top"
                                        onError={i => (i.target.src = `${DefaultAvatar}`)}
                                        src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                                        style={{ width: "80%", height: "15vw", objectFit: "cover" }}
                                        alt="Card image cap"
                                    />


                                </div>
                                <div className="col-md-8">
                                    <div className="lead mt-5">
                                        <p>Hello {user.name}</p>
                                        <p>Email : {user.email}</p>
                                        <p>Join {new Date(user.created).toDateString()}</p>
                                    </div>
                                    {isAuthenticate().user && isAuthenticate().user._id == user._id
                                        ? (
                                            <div className="d-inline-block">
                                                <Link
                                                    className="btn btn-raised btn-info mr-5"
                                                    to={`/post/new`}
                                                >
                                                    Create Post
                                                </Link>
                                                <Link
                                                    className="btn btn-raised btn-success mr-5"
                                                    to={`/user/edit/${user._id}`}
                                                >
                                                    Edit Profile
                                                </Link>
                                                <DeleteProfile userId={user._id} />
                                            </div>
                                        ) : (<FollowProfileButton
                                            following={following}
                                            onFollowButtonClick={this.onFollowButtonClick}
                                            onUnFollowButtonClick={this.onUnFollowButtonClick}
                                        />)
                                    }
                                </div>
                            </div>
                            <hr />
                            <div>
                                <ProfileTabs following={user.following} followers={user.followers} posts={posts} />
                            </div>
                        </>
                    )
                }


            </div>
        )
    }
}

export default Profile;