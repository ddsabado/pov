import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/auth';
import { AlbumGrid, Gate } from './Album';

const min24Ids = [
  'DSCF8427_a85vs4', 'DSCF8421_glffrt', 'DSCF8473_anqtqh', 'DSCF8404_jn8lmi',
  'DSCF8429_hdixsp', 'DSCF8430_z9fqnf', 'DSCF8480_nrtsww', 'DSCF8439_rca9bf',
  'DSCF8426_qq6khv', 'DSCF8432_sypzmh', 'DSCF8431_dhxiuc', 'DSCF8437_pyc3tc',
  'DSCF8436_v7b7xh', 'DSCF8402_x9esbn', 'DSCF8414_lek716', 'DSCF8419_df5skq',
  'DSCF8403_qd1lx3', 'DSCF8412_dpzqqr', 'DSCF8407_npy24k', 'DSCF8400_sg1isg',
  'DSCF8417_rix71h', 'DSCF8420_tdke2d', 'DSCF8422_kzpnb2', 'DSCF8409_engyvf',
];

const Min24 = () => {
  const { unlocked, unlock } = useAuth();
  const navigate = useNavigate();

  // If unlocked, redirect from /album to /album/min24 is handled by navbar
  // If not unlocked, show gate — on unlock redirect here
  if (!unlocked) {
    return <Gate />;
  }

  return <AlbumGrid ids={min24Ids} label="MIN '24" />;
};

export default Min24;
