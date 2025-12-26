export const getRedirectPath = (role) => {
  switch (role) {
    case 'Admin': return '/admin';
    case 'Student': return '/student';
    case 'Instructor': return '/instructor';
    default: return '/login';
  }
};
