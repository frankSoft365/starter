import { formatMonthYear } from '@/utils/dateHelper'
import FollowStats from '../follow/FollowStats';
import { useTranslation } from 'react-i18next';
import { useProfileUser } from './ProfileUserContext'

function About() {
    const { t, i18n } = useTranslation();
    const user = useProfileUser();
    const memberSince = user?.createTime
        ? formatMonthYear(new Date(user.createTime), i18n.resolvedLanguage)
        : '';

    return (
        <ul className="list w-full lg:w-2xl bg-base-100">
            {/* profile readme */}
            {/* <li className='list-row font-serif text-xl'>
                Hi! I'm Andy (Andrew when I'm in trouble).
                I'm a full-time writer and a breathwork facilitator.
                My mission is to write and breathe a better world into existence.
                If you'd like to read more of my in-depth work, I wrote a book. It's called The Joy of Breathing.
            </li> */}
            {/* info of account createAt, num of followers and followings */}
            <li className='list-row'>
                <div className="py-3">
                    <p className="text-base opacity-60">{t('profile.memberSince', { date: memberSince })}</p>
                    <FollowStats
                        userId={user?.id}
                        followerCount={user?.followerCount}
                        followingCount={user?.followingCount}
                        className="text-success my-4"
                    />
                </div>
            </li>
        </ul>
    )
}

export default About
