import { useState, useCallback, useMemo, memo } from 'react';
import { ChevronLeft, ChevronRight, Mail, Briefcase } from 'lucide-react';
import type { User } from '../../types';
import { Link } from 'react-router-dom';

interface MappedUsersProps {
  users?: User[];
}

const UserCard: React.FC<{ user: User }> = memo(({ user }) => {
  const userInitials = useMemo(() => 
    user.name.split(' ').map(n => n[0]).join(''), 
    [user.name]
  );

  return (
    <Link
      to={`/code-guides/${user.id}`}
      className="bg-slate-800 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:bg-slate-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 border border-slate-600 hover:border-purple-500 group"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:from-purple-400 group-hover:to-purple-600 transition-all duration-300">
        <span className="text-2xl font-bold text-white">
          {userInitials}
        </span>
      </div>

      <div className="text-center">
        <h3 className="text-xl font-semibold text-slate-100 mb-2 group-hover:text-purple-300 transition-colors duration-300">
          {user.name}
        </h3>
        
        <div className="flex items-center justify-center text-slate-400 mb-3 group-hover:text-slate-300 transition-colors duration-300">
          <Mail className="w-4 h-4 mr-2" />
          <span className="text-sm">{user.email}</span>
        </div>

        {user.bio && (
          <p className="text-slate-400 text-sm mb-4 line-clamp-2 group-hover:text-slate-300 transition-colors duration-300">
            {user.bio}
          </p>
        )}

        {user.profession && user.profession.length > 0 && (
          <div className="flex items-center justify-center mb-2">
            <Briefcase className="w-4 h-4 mr-2 text-purple-400" />
            <div className="flex flex-wrap gap-2 justify-center">
              {user.profession.slice(0, 2).map((prof, index) => (
                <span
                  key={index}
                  className="bg-purple-900/50 text-purple-300 px-2 py-1 rounded-full text-xs border border-purple-700 group-hover:bg-purple-800/50 group-hover:border-purple-600 transition-all duration-300"
                >
                  {prof}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          View Profile →
        </div>
      </div>
    </Link>
  );
});

const NavigationButton: React.FC<{
  onClick: () => void;
  direction: 'left' | 'right';
  disabled?: boolean;
}> = memo(({ onClick, direction, disabled = false }) => {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  const position = direction === 'left' ? 'left-4' : 'right-4';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute ${position} top-1/2 -translate-y-1/2 z-10 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-purple-500/25 disabled:hover:scale-100 disabled:hover:shadow-none`}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
});

const SlideIndicator: React.FC<{
  totalSlides: number;
  currentIndex: number;
  onSlideChange: (index: number) => void;
}> = memo(({ totalSlides, currentIndex, onSlideChange }) => (
  <div className="flex justify-center mt-8 space-x-2">
    {Array.from({ length: totalSlides }, (_, index) => (
      <button
        key={index}
        onClick={() => onSlideChange(index)}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          index === currentIndex
            ? 'bg-purple-500 w-8'
            : 'bg-slate-600 hover:bg-slate-500'
        }`}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))}
  </div>
));

const ProgressBar: React.FC<{
  currentIndex: number;
  totalSlides: number;
}> = memo(({ currentIndex, totalSlides }) => (
  <div className="mt-6 bg-slate-700 rounded-full h-1 overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300 ease-linear"
      style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
    />
  </div>
));

const MappedUsers: React.FC<MappedUsersProps> = memo(({ users = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const usersPerSlide = 3;
  
  const totalSlides = useMemo(() => 
    Math.ceil(users.length / usersPerSlide), 
    [users.length]
  );

  const getCurrentSlideUsers = useCallback(() => {
    const startIndex = currentIndex * usersPerSlide;
    return users.slice(startIndex, startIndex + usersPerSlide);
  }, [currentIndex, users, usersPerSlide]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  }, [totalSlides]);

  const currentSlideUsers = useMemo(() => getCurrentSlideUsers(), [getCurrentSlideUsers]);

  // Don't render if no users
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-transparent">
          Developers
        </h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          see codes of each developer
        </p>
      </div>

      <div className="relative bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700">
        {totalSlides > 1 && (
          <>
            <NavigationButton 
              onClick={goToPrevious} 
              direction="left"
              disabled={totalSlides <= 1}
            />
            <NavigationButton 
              onClick={goToNext} 
              direction="right"
              disabled={totalSlides <= 1}
            />
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-16">
          {currentSlideUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>

        {totalSlides > 1 && (
          <>
            <SlideIndicator
              totalSlides={totalSlides}
              currentIndex={currentIndex}
              onSlideChange={goToSlide}
            />
            <ProgressBar
              currentIndex={currentIndex}
              totalSlides={totalSlides}
            />
          </>
        )}
      </div>
    </div>
  );
});

UserCard.displayName = 'UserCard';
NavigationButton.displayName = 'NavigationButton';
SlideIndicator.displayName = 'SlideIndicator';
ProgressBar.displayName = 'ProgressBar';
MappedUsers.displayName = 'MappedUsers';

export default MappedUsers;