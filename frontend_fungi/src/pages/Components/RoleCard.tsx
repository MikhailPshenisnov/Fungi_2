import React from 'react';
import Card from 'react-bootstrap/Card';

interface RoleCardProps {
    role: string;
    name: string;
    accessLvl: number;
}


const RoleCard: React.FC<RoleCardProps> = ({ role, name, accessLvl }) => {
    return (
        <Card body>
            Id : {role}
            <br/>
            Название : {name}
            <br/>
            Уровень доступа : {accessLvl}
        </Card>
    );
}

export default RoleCard;