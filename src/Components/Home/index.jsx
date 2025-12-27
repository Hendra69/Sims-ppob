
import { useSelector, useDispatch } from 'react-redux';

import AppHeader from "./AppHeader";
import WelcomeCard from "./WelcomeCard";
import BalanceCard from "./BalanceCard";
import ServicesGrid from "./ServicesGrid";
import BannerCarousel from "./BannerCarousel";

import {
    Box,
   
} from '@mui/material';


const Home = () => {

   const dispatch = useDispatch();
  const { error } = useSelector(selectHome);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());
    dispatch(fetchServices());
    dispatch(fetchBanners());
  }, [dispatch]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      <AppHeader />

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{String(error)}</Alert>}

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, alignItems: "start" }}>
          <WelcomeCard />
          <BalanceCard />
        </Box>

        <Box sx={{ mt: 3 }}>
          <ServicesGrid />
        </Box>

        <Box sx={{ mt: 4 }}>
          <BannerCarousel />
        </Box>
      </Container>
    </Box>
  );
}

export default Home;