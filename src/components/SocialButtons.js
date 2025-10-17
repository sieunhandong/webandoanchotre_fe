import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import ChatIcon from "@mui/icons-material/Chat";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

export default function SocialButtons() {
    // 👉 Hàm xử lý khi bấm Zalo
    const handleZaloClick = () => {
        const phone = "0969729035"; // thay bằng số của bạn
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            window.location.href = `zalo://conversation?phone=${phone}`;
        } else {
            window.open(`https://zalo.me/${phone}`, "_blank");
        }
    };

    return (
        <Box
            sx={{
                position: "fixed",
                right: 20,
                top: "50%", // 👉 đặt ở giữa chiều cao
                transform: "translateY(-50%)", // căn giữa thật sự
                display: "flex",
                flexDirection: "column",
                gap: 2,
                zIndex: 2000,
            }}
        >
            {/* Facebook */}
            <Tooltip title="Facebook" placement="left">
                <IconButton
                    size="large"
                    sx={{
                        background: "linear-gradient(135deg, #1877f2, #42a5f5)",
                        color: "white",
                        boxShadow: "0 4px 10px rgba(24, 119, 242, 0.4)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #145dbf, #1e88e5)",
                            transform: "scale(1.15)",
                            boxShadow: "0 6px 15px rgba(24, 119, 242, 0.6)",
                        },
                        transition: "all 0.3s ease",
                    }}
                    component="a"
                    href="https://www.facebook.com/minh.huong.601767?locale=vi_VN"
                    target="_blank"
                >
                    <FacebookIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>

            {/* Zalo */}
            <Tooltip title="Chat Zalo" placement="left">
                <IconButton
                    size="large"
                    sx={{
                        background: "linear-gradient(135deg, #0068ff, #00b4ff)",
                        color: "white",
                        boxShadow: "0 4px 10px rgba(0,104,255,0.4)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #0056cc, #008cff)",
                            transform: "scale(1.15)",
                            boxShadow: "0 6px 15px rgba(0,104,255,0.6)",
                        },
                        transition: "all 0.3s ease",
                    }}
                    onClick={handleZaloClick}
                >
                    <ChatIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>

            {/* TikTok */}
            <Tooltip title="TikTok" placement="left">
                <IconButton
                    size="large"
                    sx={{
                        background: "linear-gradient(135deg, #000000, #333333)",
                        color: "white",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #ff0050, #000000)",
                            transform: "scale(1.15)",
                            boxShadow: "0 6px 15px rgba(255,0,80,0.5)",
                        },
                        transition: "all 0.3s ease",
                    }}
                    component="a"
                    href="https://www.tiktok.com/@_mhwgz.wtip"
                    target="_blank"
                >
                    <MusicNoteIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
        </Box>
    );
}
