import React, { Component } from "react";
import { findPeople, follow } from "./apiUser";
import DefaultAvatar from "../images/avatar.png";
import { Link } from 'react-router-dom'
import { isAuthenticate } from '../auth'

class FindPeople extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            open: false,
            followMessage: ""
        }
    }

    componentDidMount() {
        let userId = isAuthenticate().user._id
        findPeople(userId).then(data => {
            if (data.err) console.log(data.err);
            else this.setState({ users: data })
        })
    }

    clickFollow = (follow, i) => {
        let userId = isAuthenticate().user._id;
        let token = isAuthenticate().token;

        follow(userId, token, follow._id)
            .then(data => {
                if (data.err) console.log(data.err);
                else {
                    let toFollow = this.state.users;
                    toFollow.splice(i, 1);
                    this.setState({ users: toFollow, open: true, followMessage: `Following ${follow.name}` })
                }
            })
    }

    renderUser(users) {
        return <div className="row">
            {users.map((user, i) => {
                let photoUrl = user ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}` : DefaultAvatar;
                return (
                    <div className="card col-md-3 mr-5 mb-5" key={user._id}>
                        <img
                            className="card-img-top"
                            src={photoUrl}
                            onError={i => (i.target.src = `${DefaultAvatar}`)}
                            style={{ width: "100%", height: "15vw", objectFit: "cover" }}
                            alt="Card image cap" />
                        <div className="card-body">
                            <h5 className="card-title">{user.name}</h5>
                            <p className="card-text">{user.email}</p>
                            <Link to={`/user/${user._id}`} className="btn btn-primary btn-raised">View profile</Link>
                            <button onClick={() => this.clickFollow(user, i)} className="btn-raised btn-success btn float-right"> Follow</button>
                        </div>
                    </div>
                )
            })}
        </div>
    }

    render() {
        const { users, open, followMessage } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Find People</h2>
                <div className = "alert alert-success">{open && <p>{followMessage}</p>}</div>
                {this.renderUser(users)}
            </div>
        )
    }
}

export default FindPeople;
