import './Settings.css';
import { useState } from 'react';
import ProfileSettings from '../components/ProfileSettings';
import Security from '../components/Security';
<h1 className="settings-title">Настройки</h1>


function Settings({ setUser }) {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="settings-layout">
            <div className="sidebar-tabs">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={activeTab === 'profile' ? 'active' : ''}
                >
                    Профиль
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={activeTab === 'security' ? 'active' : ''}
                >
                    Безопасность
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'profile' && <ProfileSettings setUser={setUser} />}
                {activeTab === 'security' && <Security />}
            </div>
        </div>
    );
}

export default Settings;
