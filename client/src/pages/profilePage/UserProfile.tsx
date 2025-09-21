// It is no longer necessary to import React in modern React versions due to the new JSX transform.

// --- Type Definitions for Better Type Safety ---

// Interface for a single social link object
interface SocialItem {
  name: string;
  icon: "linkedin" | "leetcode" | "github" | "autocad";
  url: string;
}

// Interface for a single progress item object
interface ProgressItem {
  label: string;
  percentage: number;
  color: "sky" | "emerald" | "indigo" | "amber";
}

// Interface for the main user data object
interface UserType {
  name: string;
  id: string;
  dept: string;
  year: string;
  socials: SocialItem[];
  progress: ProgressItem[];
  image: string;
}

// Main interface for the UserProfile component's props, with an optional user prop
interface UserProfileProps {
  user?: UserType;
}

// --- Data ---
// Define a default user object that now explicitly adheres to the UserType interface.
export const defaultUser: UserType = {
  name: "Mathimalar",
  id: "950023104031",
  dept: "Computer Science and Engineering",
  year: "III year",
  socials: [
    { name: "Linked In", icon: "linkedin", url: "https://www.linkedin.com" },
    { name: "Leetcode", icon: "leetcode", url: "https://www.leetcode.com" },
    { name: "GitHub", icon: "github", url: "https://www.github.com" },
    { name: "AutoCAD", icon: "autocad", url: "https://www.autodesk.com/products/autocad" },
  ],
  progress: [
    { label: "Aptitude", percentage: 80, color: "sky" },
    { label: "Java", percentage: 65, color: "emerald" },
    { label: "Python", percentage: 90, color: "indigo" },
    { label: "C", percentage: 75, color: "amber" },
  ],
  image: "https://placehold.co/160x160/ffffff/282c34?text=User",
};

// --- Components ---

// Helper component for a single social link with explicit types
const SocialLink = ({ name, icon, url }: SocialItem) => {
  const colorClasses = {
    linkedin: { text: "text-blue-600", hoverBg: "hover:bg-blue-600" },
    leetcode: { text: "text-green-600", hoverBg: "hover:bg-green-600" },
    github: { text: "text-gray-800", hoverBg: "hover:bg-gray-800" },
    autocad: { text: "text-red-600", hoverBg: "hover:bg-red-600" },
  };
  const classes = colorClasses[icon] || { text: "text-gray-600", hoverBg: "hover:bg-gray-400" };

  // SVG icons for each social platform
  const icons = {
    linkedin: <svg className="fill-current w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.118-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>,
    leetcode: <svg className="fill-current w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.134 6.942l-.527.712-.132.179c-.583.788-1.077 1.455-1.542 2.062-.465.607-.866 1.127-1.258 1.542-.392.415-.712.636-1.077.747l-1.42.368-1.53.395.77 1.95 2.13-1.066c.55-.275 1.134-.56 1.756-.867.622-.307 1.17-.55 1.583-.728l1.41-1.353-.198-.198c.55-.275 1.134-.56 1.756-.867.622-.307 1.17-.55 1.583-.728l1.41-1.353-.198-.198c.55-.275 1.134-.56 1.756-.867.622-.307 1.17-.55 1.583-.728l1.41-1.353-.198-.198c.55-.275 1.134-.56 1.756-.867.622-.307 1.17-.55 1.583-.728l1.41-1.353-.198-.198zm1.096 1.439l-.17.23-.228.308c-.783 1.059-1.442 1.944-2.071 2.766-.629.822-1.157 1.503-1.637 2.053-.48.55-1.014.928-1.434 1.196l-.99.59c-.48.286-.928.43-1.434.43-.506 0-1.014-.144-1.434-.43-.42-.267-.928-.646-1.434-1.196-.506-.55-1.014-.928-1.434-1.196-.42-.267-.928-.646-1.434-1.196l-1.033-.615-.558.948 1.44.821c.54.307 1.126.591 1.755.867.629.275 1.177.519 1.583.727l1.41 1.353.198.198c-.55.275-1.134.56-1.756.867-.622.307-1.17.55-1.583.728l-1.41 1.353.198.198c-.55.275-1.134.56-1.756.867-.622.307-1.17.55-1.583.728l-1.41 1.353.198.198c-.55.275 1.134-.56 1.756-.867.622-.307 1.17-.55 1.583-.728l1.41-1.353.198-.198z" /></svg>,
    github: <svg className="fill-current w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.836 2.809 1.305 3.492.997.107-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.771.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.6.804.576 4.765-1.589 8.2-6.091 8.2-11.386 0-6.627-5.373-12-12-12z" /></svg>,
    autocad: <svg className="fill-current w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.134 6.942l-.527.712-.132.179c-.583.788-1.077 1.455-1.542 2.062-.465.607-.866 1.127-1.258 1.542-.392.415-.712.636-1.077.747l-1.42.368-1.53.395.77 1.95 2.13-1.066c.55-.275 1.134-.56 1.756-.867.622-.307 1.17-.55 1.583-.728l1.41-1.353-.198-.198c.55-.275 1.134-.56 1.756-.867.622-.307 1.17-.55 1.583-.728l1.41-1.353-.198-.198c.55-.275 1.134-.56 1.756-.867.622-.307 1.17-.55 1.583-.728l1.41-1.353-.198-.198z" /></svg>,
  };
  return (
    <li className="flex items-center space-x-2">
      <a
        href={url}
        target="_parent"
        rel="noopener noreferrer"
        className={`flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 ${classes.hoverBg} group`}
      >
        <span className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${classes.text} group-hover:text-white`}>
          {icons[icon] || <div className="w-5 h-5 bg-gray-400 rounded-full"></div>}
        </span>
        <span className="text-gray-600 group-hover:text-white transition-colors duration-200">{name}</span>
      </a>
    </li>
  );
};

// Helper component for a single progress bar with explicit types
const ProgressBar = ({ label, percentage, color }: ProgressItem) => {
  const colorMap = {
    sky: { text: "text-sky-600", from: "from-sky-400", to: "to-sky-600" },
    emerald: { text: "text-emerald-600", from: "from-emerald-400", to: "to-emerald-600" },
    indigo: { text: "text-indigo-600", from: "from-indigo-400", to: "to-indigo-600" },
    amber: { text: "text-amber-600", from: "from-amber-400", to: "to-amber-600" },
  };

  const selectedColor = colorMap[color] || { text: "text-gray-600", from: "from-gray-400", to: "to-gray-600" };

  return (
    <div className="space-y-1 transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg rounded-lg p-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        <span className={`text-xs font-semibold ${selectedColor.text}`}>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`bg-gradient-to-r ${selectedColor.from} ${selectedColor.to} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// The main App component that renders the entire user profile page with explicit types
const UserProfile = ({ user = defaultUser }: UserProfileProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col lg:flex-row border border-gray-200 transition-transform duration-300 hover:scale-[1.01]">
        {/* Left Panel: Profile Information */}
        <div className="w-full lg:w-1/3 p-8 flex flex-col items-center bg-white text-gray-800 border-b lg:border-r lg:border-b-0 border-gray-200">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gray-300 shadow-lg transition-transform duration-300 hover:scale-105">
            {/* User profile image */}
            <img src={user.image} alt={`${user.name}'s profile`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-gray-800 tracking-wide">{user.name}</h2>
          <p className="text-sm text-gray-500 font-mono mt-1">{user.id}</p>
          <p className="mt-4 text-md text-gray-600 font-light text-center">{user.dept}</p>
          <p className="text-sm text-gray-500">{user.year}</p>

          {/* Social Links Section */}
          <div className="w-full mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">Socials</h3>
            <ul className="space-y-4 text-gray-600">
              {user.socials.map((social) => (
                <SocialLink key={social.name} {...social} />
              ))}
            </ul>
          </div>
        </div>

        {/* Right Panel: Progress and Status */}
        <div className="w-full lg:w-2/3 p-8 bg-white text-gray-800">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">Progress</h3>

          {/* Progress Bars Section */}
          <div className="space-y-8">
            {user.progress.map((progressItem) => (
              <ProgressBar key={progressItem.label} {...progressItem} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
