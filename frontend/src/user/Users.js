import React, { Component } from "react";
import { getAllUser } from "./apiUser";
import DefaultAvatar from "../images/avatar.png";
import { Link } from 'react-router-dom'

class Users extends Component {
    constructor() {
        super();
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        getAllUser().then(data => {
            if (data.err) console.log(data.err);
            else this.setState({ users: data })
        })
    }

    renderUser(users) {
        return <div className="row">
            {users.map((user) => {
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
                        </div>
                    </div>
                )
            })}
        </div>
    }

    render() {
        const { users } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Users</h2>

                {this.renderUser(users)}
            </div>
        )
    }
}

export default Users;
