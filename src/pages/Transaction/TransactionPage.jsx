import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";

import AppHeader from "../../components/layout/AppHeader";
import WelcomeCard from "../../components/home/Welcome";
import BalanceCard from "../../components/home/BalanceCard";

import { fetchProfile, fetchBalance } from "../../Features/homeSlice";
import {
  fetchHistory,
  selectHistoryItems,
  selectHistoryOffset,
  selectHistoryLimit,
  selectHistoryLoading,
  selectHistoryError,
  selectHistoryHasMore,
  resetHistory,
} from "../../Features/transactionHistorySlice";

const formatRupiah = (n) =>
  `Rp${new Intl.NumberFormat("id-ID").format(Math.abs(Number(n) || 0))}`;

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return iso || "-";
  }
};


function HistoryRow({ record }) {
  const type = record?.transaction_type || "";
  const isPlus = type === "TOPUP"; 
  const amount = record?.total_amount ?? 0;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        borderColor: "#eee",
        mb: 1.5,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <Box>
        <Typography
          sx={{
            fontWeight: 800,
            color: isPlus ? "#2E7D32" : "#D32F2F",
            fontSize: 16,
          }}
        >
          {isPlus ? "+ " : "- "}
          {formatRupiah(amount)}
        </Typography>
        <Typography sx={{ color: "#9E9E9E", fontSize: 12, mt: 0.3 }}>
          {formatDate(record?.created_on)}
        </Typography>
      </Box>

      <Typography sx={{ color: "#777", fontSize: 12, mt: 0.3 }}>
        {record?.description || "-"}
      </Typography>
    </Paper>
  );
}

export default function TransactionPage() {
  const dispatch = useDispatch();

  const items = useSelector(selectHistoryItems);
  const offset = useSelector(selectHistoryOffset);
  const limit = useSelector(selectHistoryLimit);
  const loading = useSelector(selectHistoryLoading);
  const error = useSelector(selectHistoryError);
  const hasMore = useSelector(selectHistoryHasMore);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());

    dispatch(resetHistory());
    dispatch(fetchHistory({ offset: 0, limit }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleShowMore = () => {
    if (loading || !hasMore) return;
    dispatch(fetchHistory({ offset: offset + limit, limit }));
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      <AppHeader />

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          <WelcomeCard />
          <BalanceCard />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            Semua Transaksi
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {error && (
            <Typography sx={{ color: "#D32F2F", mb: 2, fontSize: 13 }}>
              {String(error)}
            </Typography>
          )}

          {items.map((r, idx) => (
            <HistoryRow key={r?.invoice_number || idx} record={r} />
          ))}

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={22} />
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            {hasMore ? (
              <Button
                onClick={handleShowMore}
                disabled={loading}
                sx={{
                  textTransform: "none",
                  color: "#E53935",
                  fontWeight: 800,
                }}
              >
                Show more
              </Button>
            ) : (
              <Typography sx={{ color: "#9E9E9E", fontSize: 12 }}>
                Tidak ada transaksi lagi
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
