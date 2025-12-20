import React from 'react';
import Card from 'react-bootstrap/Card';

interface UserCardProps {
    email: string;
    name: string;
    needRole: boolean;
    role: string;
    needId: boolean;
    Id: string;
}


const UserCard: React.FC<UserCardProps> = ({ email, name, needRole,role, needId, Id }) => {
    return (
        <Card body>
            <br/>
            {needId && <div>Id : {Id} <br/></div>}
            Почта : {email}
            <br/>
            Имя : {name}
            <br/>
            {needRole && <div>Id роли : {role}</div>}
        </Card>
    );
}

export default UserCard;