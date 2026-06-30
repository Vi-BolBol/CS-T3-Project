// Simple modular state slice mock reflecting your Redux toolkit structure
const initialUserState = {
  profile: {
    username: 'TechSomethingIDK',
    role: 'Full Stack Intern',
    location: 'Phnom Penh, Cambodia',
    website: 'portfolio.dev',
    email: 'techsomethingidk@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    bio: 'I am a senior computer science student with a passion for leveraging data to solve complex problems.',
  },
  loading: false,
  error: null,
};

export function userReducer(state = initialUserState, action) {
  switch (action.type) {
    case 'user/updateProfile':
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
      };
    case 'user/setLoading':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

// Action Creator
export const updateProfile = (profileData) => ({
  type: 'user/updateProfile',
  payload: profileData,
});