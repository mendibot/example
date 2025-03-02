import {User} from '.';

interface SidebarProps {
    user: User;
}

export function Sidebar({user}: SidebarProps) {
    return (
        <div>
            <div>{user.name}</div>
            <div>Subscription Status: {user.isSubscribed}</div>
        </div>
    )
}

interface ProfileProps {
    user: User;
}

export function Profile({user}: ProfileProps) {
    return <div>{user.name}</div>
}