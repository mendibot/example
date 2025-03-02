import { Profile, Sidebar } from './Components.jsx'
import {User} from '.'

interface DashboardProps {
    user : User;
}

export default function Dashboard({user}: DashboardProps) {
    return (
        <div>
            <Sidebar user={user} />
            <Profile user={user} />
        </div>
    );
}