import { Constants } from '../util/constants';

export interface Role {
  role: string;
}
export const Access_type = [
  Constants.ROLE_USER,
  Constants.ROLE_ADMIN,
  Constants.ROLE_GAD_HEAD,
  Constants.ROLE_DEP_HEAD,
  Constants.ROLE_MO,
  Constants.ROLE_MEC,
  Constants.ROLE_SUPER_ADMIN,
];
