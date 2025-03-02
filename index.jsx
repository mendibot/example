import {useState} from 'react';

import Dashboard from './Dashboard';

export interface User {
    isSubscribed: Boolean;
    name: String;       
}

interface DemoProps {}

export default function Demo({}: DemoProps) {
    cont [user] = useState<User>({
        isSubscribed: true,
        name: 'You',
    });

    return (
        <div>
            <Dashboard user={user} />
        </div>
    );
}

