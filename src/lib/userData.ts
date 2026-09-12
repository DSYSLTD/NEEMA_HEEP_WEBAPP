export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  fullName?: string;
  county?: string;
}

export const defaultUser: UserProfile = {
  id: 'usr_01',
  name: 'Grace Wanjiku',
  email: 'grace@neemaheep.org',
  phone: '+254 712 345 678',
  role: 'Loan Officer',
};

export function getUserData(): Partial<UserProfile> {
  try {
    const data = localStorage.getItem('neema_user_data');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

export function saveUserData(data: Partial<UserProfile>) {
  try {
    const current = getUserData();
    localStorage.setItem('neema_user_data', JSON.stringify({ ...current, ...data }));
  } catch (e) {
    console.warn("Could not save user data:", e);
  }
}
