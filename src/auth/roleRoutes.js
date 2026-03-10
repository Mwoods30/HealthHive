export const ROLE_PATIENT = 'patient';
export const ROLE_PROVIDER = 'provider';
export const ROLE_ADMIN = 'admin';

export const ROLE_OPTIONS = [
  {
    role: ROLE_PATIENT,
    label: 'Patient',
    description: 'Track symptoms, view results, and manage personal health history.',
  },
  {
    role: ROLE_PROVIDER,
    label: 'Provider',
    description: 'Review patient trends and prioritize follow-up care.',
  },
  {
    role: ROLE_ADMIN,
    label: 'Site Admin',
    description: 'Manage platform settings and operational health.',
  },
];

export const DEFAULT_ROUTE_BY_ROLE = {
  [ROLE_PATIENT]: '/patient',
  [ROLE_PROVIDER]: '/provider',
  [ROLE_ADMIN]: '/admin',
};

export function isRoleValid(role) {
  return Object.prototype.hasOwnProperty.call(DEFAULT_ROUTE_BY_ROLE, role);
}

export function getDefaultRouteForRole(role) {
  return DEFAULT_ROUTE_BY_ROLE[role] || '/';
}
