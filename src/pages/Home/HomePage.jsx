import React, { useEffect, useState } from "react";
import { Box, Container, Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import AppHeader from "../../components/layout/AppHeader";
import WelcomeCard from "../../components/home/Welcome";
import BalanceCard from "../../components/home/BalanceCard";
import ServiceGrid from "../../components/home/ServicesGrid";
import PaymentForm from "../../components/home/PaymentForm";
import BannerCarousel from "../../components/home/BannerCarousel";

import TopUpPage from "../TopUp/TopUpPage";
import TransactionPage from "../Transaction/TransactionPage";
import AccountPage from "../Account/AccountPage";

import { fetchProfile, fetchBalance, fetchServices, fetchBanners, selectHome } from "../../Features/homeSlice";
import {
    payService,
    clearTransactionState,
    selectTxnLoading,
    selectTxnError,
    selectTxnSuccess,
} from "../../Features/transactionSlice";

export default function HomePage() {
    const dispatch = useDispatch();
    const { services } = useSelector(selectHome);

    const Loading = useSelector(selectTxnLoading);
    const Error = useSelector(selectTxnError);
    const Success = useSelector(selectTxnSuccess);

    const [selectedService, setSelectedService] = useState(null);

    const [activeMenu, setActiveMenu] = useState("home");

    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetchBalance());
        dispatch(fetchServices());
        dispatch(fetchBanners());
    }, [dispatch]);

    const handlePay = async (amount) => {
        if (!selectedService) return;
        try {
            await dispatch(payService({ service_code: selectedService.service_code, amount })).unwrap();
            setSelectedService(null);
        } catch (_) { }
    };

    useEffect(() => {
        if (activeMenu !== "home") setSelectedService(null);
    }, [activeMenu]);

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
            <AppHeader activeMenu={activeMenu} onChangeMenu={setActiveMenu} />

            {activeMenu === "topup" && <TopUpPage />}
            {activeMenu === "transaction" && <TransactionPage />}
            {activeMenu === "account" && <AccountPage />}

            {activeMenu === "home" && (
                <Container maxWidth="lg" sx={{ py: 3 }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                        <WelcomeCard />
                        <BalanceCard />
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <ServiceGrid services={services || []} onSelect={setSelectedService} />

                        {selectedService && (
                            <PaymentForm
                                service={selectedService}
                                loading={Loading}
                                onPay={handlePay}
                            />
                        )}
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <BannerCarousel />
                    </Box>

                    <Snackbar
                        open={Boolean(Success)}
                        autoHideDuration={2500}
                        onClose={() => dispatch(clearTransactionState())}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    >
                        <Alert severity="success" variant="filled" onClose={() => dispatch(clearTransactionState())}>
                            {Success}
                        </Alert>
                    </Snackbar>

                    <Snackbar
                        open={Boolean(Error)}
                        autoHideDuration={2500}
                        onClose={() => dispatch(clearTransactionState())}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    >
                        <Alert severity="error" variant="filled" onClose={() => dispatch(clearTransactionState())}>
                            {String(Error)}
                        </Alert>
                    </Snackbar>
                </Container>
            )}
        </Box>
    );
}
