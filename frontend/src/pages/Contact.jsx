import { Box, TextField, useMediaQuery } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { RedButton } from "../utils/buttonStyles";
import iconmail  from "../assets/icon-mail.png";

function Contact() {
    const isMobile = useMediaQuery("(max-width:768px)");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/nodemail", {
                email: formData.email,
                subject: `Message from ${formData.name} (${formData.phone})`,
                text: formData.message,
            });

            alert("Email successfully sent!");
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send email. Please try again later.");
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "flex-start",
                maxWidth: "1170px",
                margin: "140px auto",
                padding: isMobile ? "0 20px" : "0 8%",
            }}
        >
            <Box>
                <Box
                    sx={{
                        width: "100%",
                        marginBottom: isMobile ? "24px" : "0",
                        display: "block",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img src={iconmail} alt="mail-icon" style={{ width: "15%" }} />
                        <h3 style={{ marginLeft: "16px", fontWeight: "500" }}>Call To Us</h3>
                    </Box>
                    <Box sx={{ display: "block", marginTop: "24px" }}>
                        <p>We are available 24/7, 7 days a week.</p>
                        <p style={{ margin: "16px 0" }}>Phone: +8801611112222</p>
                    </Box>
                </Box>

                <hr
                    style={{
                        color: "#000000",
                        backgroundColor: "#000000",
                        height: 0.01,
                        margin: "32px 0 32px 1rem",
                        maxWidth: "270px",
                    }}
                />

                <Box
                    sx={{
                        width: "100%",
                        marginBottom: isMobile ? "24px" : "0",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img src={iconmail} alt="mail-icon" style={{ width: "15%" }} />
                        <h3 style={{ marginLeft: "16px", fontWeight: "500" }}>Write To Us</h3>
                    </Box>
                    <Box sx={{ display: "block", marginTop: "24px", maxWidth: "270px" }}>
                        <p>Fill out our form and we will contact you within 24 hours.</p>
                        <p style={{ margin: "16px 0" }}>Emails: customer@exclusive.com</p>
                        <p>Emails: support@exclusive.com</p>
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    maxWidth: "737px",
                    display: "block",
                    margin: isMobile ? "0" : "0 auto",
                    width: "100%",
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            justifyContent: "space-between",
                            gap: isMobile ? "16px" : "0",
                        }}
                    >
                        <TextField
                            name="name"
                            label="Your Name"
                            variant="standard"
                            required
                            fullWidth
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <TextField
                            name="email"
                            label="Your Email"
                            variant="standard"
                            required
                            fullWidth
                            value={formData.email}
                            onChange={handleChange}
                            style={{ margin: isMobile ? "16px 0" : "0 16px" }}
                        />
                        <TextField
                            name="phone"
                            label="Your Phone"
                            variant="standard"
                            required
                            fullWidth
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </Box>

                    <TextField
                        name="message"
                        label="Your Message"
                        multiline
                        rows={8}
                        variant="standard"
                        required
                        fullWidth
                        value={formData.message}
                        onChange={handleChange}
                        sx={{ width: "100%", marginTop: "32px", marginBottom: "32px" }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "32px" }}>
                        <RedButton type="submit" >
                            Send Message
                        </RedButton>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}

export default Contact;