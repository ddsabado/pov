import { useParams } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { AlbumGrid, Gate } from './Album';

const albums: Record<string, { label: string; ids: string[] }> = {
  'min24': {
    label: "MIN '24",
    ids: [
      'DSCF8427_a85vs4', 'DSCF8421_glffrt', 'DSCF8473_anqtqh', 'DSCF8404_jn8lmi',
      'DSCF8429_hdixsp', 'DSCF8430_z9fqnf', 'DSCF8480_nrtsww', 'DSCF8439_rca9bf',
      'DSCF8426_qq6khv', 'DSCF8432_sypzmh', 'DSCF8431_dhxiuc', 'DSCF8437_pyc3tc',
      'DSCF8436_v7b7xh', 'DSCF8402_x9esbn', 'DSCF8414_lek716', 'DSCF8419_df5skq',
      'DSCF8403_qd1lx3', 'DSCF8412_dpzqqr', 'DSCF8407_npy24k', 'DSCF8400_sg1isg',
      'DSCF8417_rix71h', 'DSCF8420_tdke2d', 'DSCF8422_kzpnb2', 'DSCF8409_engyvf',
    ],
  },
  'tw24': {
    label: "TW '24",
    ids: [
      'DSCF6694_ftkjdy', 'DSCF6706_t9ahev', 'DSCF6700_vt1efr', 'DSCF6710_ruyjj4',
      'DSCF6690_dnrg2p', 'DSCF6707_jxdtgd', 'DSCF6705_abmzd9', 'DSCF6709_e3gvb6',
      'DSCF6692_m2toag', 'DSCF6689_xcf7ip', 'DSCF6712_ukmds8', 'DSCF6677_qixske',
      'DSCF6683_krameo', 'DSCF6680_qsbkbe', 'DSCF6668_l8inhb', 'DSCF6676_uairns',
      'DSCF6667_vzw95k', 'DSCF6660_yuwlz9', 'DSCF6661_ya8eln', 'DSCF6659_ojqtlb',
      'DSCF6656_zkwc3y', 'DSCF6650_tnlv8a', 'DSCF6655_kfo8xq', 'DSCF6640_pjrdlg',
      'DSCF6649_aqak32', 'DSCF6646_ecyyso', 'DSCF6633_zefz6r', 'DSCF6630_cqyxyd',
      'DSCF6612_w1fsqe', 'DSCF6638_jdcwvh', 'DSCF6621_kegqy9', 'DSCF6644_nl7nld',
      'DSCF6610_rfnpwg', 'DSCF6611_wdw7jj', 'DSCF6615_slwau2', 'DSCF6609_xjhqii',
      'DSCF6608_cshkfe', 'DSCF6617_zefxdb', 'DSCF6607_ft6ms9', 'DSCF6627_jyrx12',
      'DSCF6622_tlaaiy', 'DSCF6604_ymfr03', 'DSCF6606_ykfq7e', 'DSCF6605_flrdz1',
      'DSCF6599_zbshcn', 'DSCF6595_xzc0bk', 'DSCF6591_tpuehe', 'DSCF6589_huodsg',
      'DSCF6586_pc6hua', 'DSCF6582_hjnyk6', 'DSCF6578_czqt4n', 'DSCF6577_axnuyv',
      'DSCF6562_xm22as', 'DSCF6563_yqcfg3', 'DSCF6558_ffnxsf', 'DSCF6556_erumbe',
      'DSCF6557_mcg7fk', 'DSCF6555_oxe7wm', 'DSCF6554_gxjlbj', 'DSCF6550_idegfs',
      'DSCF6553_fxcvch', 'DSCF6544_jecnsn', 'DSCF6543_dzyjwz', 'DSCF6541_apkosm',
      'DSCF6531_rwxtti', 'DSCF6542_ojndtj', 'DSCF6530_fvytk9', 'DSCF6533_qmqnqv',
      'DSCF6526_fmg6rm', 'DSCF6525_de9nw0', 'DSCF6527_zdare6', 'DSCF6523_nincfi',
      'DSCF6504_abjiw7', 'DSCF6519_s5gv7f', 'DSCF6711_dzehiz', 'DSCF4267_dxssos',
      'DSCF6346_xaonlw', 'DSCF6513_c7zx6z', 'DSCF6279_blsjft', 'DSCF6511_h9uyam',
      'DSCF5823_ldmiat', 'DSCF6337_xcjn81', 'DSCF6517_ajpzwz', 'DSCF6587_eoxyq6',
    ],
  },
  'tw25': {
    label: "TW '25",
    ids: [
      'DSCF9754_h8q00y', 'DSCF9758_ugwrnu', 'DSCF9747_gsrgch', 'DSCF9805_zi2jce',
      'DSCF9793_fbp0vh', 'DSCF9744_bbfpp0', 'DSCF9766_m56uus', 'DSCF9741_cp5fvj',
      'DSCF9738_iksi5f', 'DSCF9725_foasfi', 'DSCF9718_ykjci4', 'DSCF9719_pxoztz',
      'DSCF9714_gqsmyv', 'DSCF9710_qh8bzn', 'DSCF9706_qydakd', 'DSCF9701_yuaic5',
      'DSCF9703_r6anl8', 'DSCF9698_nxu9r5', 'DSCF9694_rsetpv', 'DSCF9688_q9lqdf',
      'DSCF9680_biwkrs', 'DSCF9675_pvhvjb', 'DSCF9676_neo4gh', 'DSCF9687_mag2qr',
      'DSCF9666_ed2ki6', 'DSCF9668_uu5bff', 'DSCF9660_nrmiwt', 'DSCF9602_duqepb',
      'DSCF9657_wbtta2', 'DSCF9651_kttmog', 'DSCF9655_ncyxua', 'DSCF9649_nxifxt',
      'DSCF9629_gwfyxa', 'DSCF9617_ambvcb', 'DSCF9606_noezwh', 'DSCF9591_itbdxy',
      'DSCF9573_e95hnz', 'DSCF9589_pvszxu', 'DSCF9576_lqkxp3', 'DSCF9535_vjmsxp',
      'DSCF9526_x09ogg', 'DSCF9518_zixx8g', 'DSCF9512_nsn3g3', 'DSCF9501_xdteu1',
      'DSCF9407_apdwwe', 'DSCF9417_hjhmbt', 'DSCF9421_wqaobh', 'DSCF9423_q8o1ap',
      'DSCF9459_ixhnks', 'DSCF9448_nz4phj',
    ],
  },
};

const AlbumPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { unlocked } = useAuth();
  const album = slug ? albums[slug] : null;

  if (!unlocked) return <Gate />;
  if (!album) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="font-meta text-gray-600 text-[11px] tracking-[0.2em] uppercase">Not found</p>
    </div>
  );

  return <AlbumGrid ids={album.ids} label={album.label} />;
};

export default AlbumPage;
