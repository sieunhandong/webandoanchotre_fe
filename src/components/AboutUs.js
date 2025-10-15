import React from "react";
import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    Button,
    Divider,
    Card,
    CardContent,
} from "@mui/material";
import {
    EmojiObjectsOutlined,
    FavoriteBorderOutlined,
    GroupOutlined,
    MenuBookOutlined,
    LocalDiningOutlined,
    TrendingUpOutlined,
} from "@mui/icons-material";

const AboutUs = () => {
    return (
        <Box sx={{
            backgroundColor: "#fafafa",
            py: 8,
            background: "linear-gradient(135deg, #f5fdff 0%, #ffffff 100%)"
        }}>
            <Container maxWidth="lg">
                {/* ===== SỨ MỆNH ===== */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 6 },
                        borderRadius: 6,
                        mb: 10,
                        background: "linear-gradient(135deg, #74CEF2 0%, #8BD8F5 100%)",
                        color: "white",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                        '&::before': {
                            content: '""',
                            position: "absolute",
                            top: -50,
                            right: -50,
                            width: 150,
                            height: 150,
                            borderRadius: "50%",
                            backgroundColor: "rgba(255,255,255,0.1)",
                        },
                        '&::after': {
                            content: '""',
                            position: "absolute",
                            bottom: -30,
                            left: -30,
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            backgroundColor: "rgba(255,255,255,0.1)",
                        }
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        gutterBottom
                        sx={{
                            fontSize: { xs: '1.75rem', md: '2.125rem' },
                            position: "relative",
                            zIndex: 1
                        }}
                    >
                        SỨ MỆNH CỦA TINYYUMMY
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            maxWidth: 800,
                            mx: "auto",
                            lineHeight: 1.8,
                            fontSize: "1.1rem",
                            opacity: 0.95,
                            position: "relative",
                            zIndex: 1
                        }}
                    >
                        TinyYummy hướng tới việc đồng hành cùng phụ huynh trong hành trình ăn dặm của bé.
                        Mang đến những bữa ăn lành mạnh, đa dạng dinh dưỡng và phù hợp với từng giai đoạn phát triển.
                        Chúng tôi tin rằng, ăn dặm là nền tảng quan trọng giúp bé phát triển khỏe mạnh và hạnh phúc.
                    </Typography>
                </Paper>

                {/* ===== VỀ TINYYUMMY ===== */}
                <Grid container spacing={6} alignItems="center" mb={10}>
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                            gutterBottom
                            sx={{ color: "#2C3E50" }}
                        >
                            VỀ TINYYUMMY
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#555", mb: 3 }}>
                            TinyYummy ra đời với sứ mệnh giúp phụ huynh dễ dàng tiếp cận thông tin, công thức
                            và kiến thức về ăn dặm khoa học. Chúng tôi cung cấp hệ thống bài viết, công cụ và hướng dẫn chi tiết
                            giúp phụ huynh tự tin hơn trong việc chăm sóc dinh dưỡng cho con yêu.
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                            {[
                                { icon: <MenuBookOutlined />, text: "Công thức" },
                                { icon: <LocalDiningOutlined />, text: "Dinh dưỡng" },
                                { icon: <TrendingUpOutlined />, text: "Phát triển" }
                            ].map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        px: 2,
                                        py: 1,
                                        backgroundColor: "#F0F9FF",
                                        borderRadius: 3,
                                        color: "#74CEF2",
                                        fontWeight: 600
                                    }}
                                >
                                    {item.icon}
                                    <Typography variant="body2">{item.text}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                height: 300,
                                borderRadius: 4,
                                background: "linear-gradient(135deg, #74CEF2 0%, #8BD8F5 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "4rem",
                                boxShadow: "0 10px 30px rgba(116, 206, 242, 0.3)"
                            }}
                        >
                            🍎
                        </Box>
                    </Grid>
                </Grid>

                {/* ===== TẠI SAO CHỌN CHÚNG TÔI ===== */}
                <Box textAlign="center" mb={8}>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        gutterBottom
                        sx={{ color: "#2C3E50" }}
                    >
                        TẠI SAO CHỌN CHÚNG TÔI?
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 6, color: "#666", maxWidth: 600, mx: "auto" }}>
                        Chúng tôi luôn nỗ lực mang đến trải nghiệm tốt nhất cho phụ huynh và bé yêu.
                    </Typography>
                </Box>

                <Grid container spacing={4} mb={6}>
                    {[
                        {
                            icon: "👶",
                            title: "Chuyên gia dinh dưỡng",
                            desc: "Đội ngũ chuyên gia giàu kinh nghiệm"
                        },
                        {
                            icon: "🥕",
                            title: "Nguyên liệu tự nhiên",
                            desc: "100% nguyên liệu sạch và an toàn"
                        },
                        {
                            icon: "❤️",
                            title: "Yêu thương trong từng món",
                            desc: "Chế biến với tình yêu trẻ nhỏ"
                        }
                    ].map((item, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card
                                elevation={0}
                                sx={{
                                    height: 200,
                                    borderRadius: 4,
                                    background: "white",
                                    border: "1px solid #e0f7ff",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    p: 3,
                                    transition: "all 0.3s ease",
                                    '&:hover': {
                                        transform: "translateY(-5px)",
                                        boxShadow: "0 10px 30px rgba(116, 206, 242, 0.2)"
                                    }
                                }}
                            >
                                <Typography variant="h2" sx={{ mb: 2 }}>{item.icon}</Typography>
                                <Typography variant="h6" fontWeight={600} sx={{ color: "#2C3E50", mb: 1 }}>
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#666" }}>
                                    {item.desc}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* ===== GIÁ TRỊ CỐT LÕI ===== */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        borderRadius: 4,
                        mb: 10,
                        backgroundColor: "#F8FDFF",
                        border: "1px solid #e0f7ff"
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            textAlign: "center",
                            lineHeight: 1.8,
                            fontSize: "1.1rem",
                            color: "#555"
                        }}
                    >
                        <Box component="span" sx={{ color: "#74CEF2", fontWeight: 600 }}>•</Box> Tất cả sản phẩm được kiểm chứng kỹ lưỡng và phát triển cùng chuyên gia dinh dưỡng. <br />
                        <Box component="span" sx={{ color: "#74CEF2", fontWeight: 600 }}>•</Box> Chúng tôi mang lại sự an tâm và tiện lợi cho phụ huynh trong hành trình nuôi dưỡng bé khỏe mạnh. <br />
                        <Box component="span" sx={{ color: "#74CEF2", fontWeight: 600 }}>•</Box> Thấu hiểu cha mẹ, đồng hành cùng con yêu trên từng bước phát triển.
                    </Typography>
                </Paper>

                {/* ===== ĐIỀU MUỐN NÓI ===== */}
                <Grid container spacing={4} mb={10} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                height: 300,
                                borderRadius: 4,
                                background: "linear-gradient(135deg, #FFD6E7 0%, #74CEF2 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "4rem",
                                boxShadow: "0 10px 30px rgba(116, 206, 242, 0.3)"
                            }}
                        >
                            🌟
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                            gutterBottom
                            sx={{ color: "#2C3E50" }}
                        >
                            ĐIỀU MUỐN NÓI
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#555", mb: 3 }}>
                            TinyYummy không chỉ là nền tảng về ăn dặm, mà còn là người bạn đồng hành của phụ huynh trong việc
                            nuôi dạy và chăm sóc trẻ nhỏ. Chúng tôi mong muốn lan tỏa tình yêu thương, sự kiên nhẫn và niềm vui
                            trong từng bữa ăn của bé.
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    backgroundColor: "#74CEF2",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white"
                                }}
                            >
                                <FavoriteBorderOutlined />
                            </Box>
                            <Typography variant="body2" sx={{ color: "#74CEF2", fontWeight: 600 }}>
                                Yêu thương từng khoảnh khắc phát triển của bé
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 6, borderColor: "#e0f7ff" }} />

                {/* ===== CONTACT ===== */}
                <Box textAlign="center">
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        gutterBottom
                        sx={{ color: "#2C3E50" }}
                    >
                        Liên hệ với chúng tôi!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: "#666", maxWidth: 500, mx: "auto" }}>
                        Cùng nhau xây dựng hành trình ăn dặm tuyệt vời cho bé yêu
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2, flexWrap: "wrap" }}>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                backgroundColor: "#74CEF2",
                                borderRadius: 3,
                                px: 4,
                                py: 1.5,
                                fontSize: "1rem",
                                fontWeight: 600,
                                "&:hover": {
                                    backgroundColor: "#5CB8D9",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 5px 15px rgba(116, 206, 242, 0.4)"
                                },
                                transition: "all 0.3s ease"
                            }}
                        >
                            Gửi tin nhắn
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                borderColor: "#74CEF2",
                                color: "#74CEF2",
                                borderRadius: 3,
                                px: 4,
                                py: 1.5,
                                fontSize: "1rem",
                                fontWeight: 600,
                                "&:hover": {
                                    backgroundColor: "#F0F9FF",
                                    borderColor: "#5CB8D9",
                                    transform: "translateY(-2px)"
                                },
                                transition: "all 0.3s ease"
                            }}
                        >
                            Tới fanpage
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default AboutUs;