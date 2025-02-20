import { Box } from "@mui/material";
import AboutImg from "../assets/AboutImg.png";

function About() {
    return (
        <>
            <Box
                className="about-container"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    maxWidth: "1035px",
                    margin: "8rem auto",
                }}
            >
                {/* Szöveg rész */}
                <Box
                    className="about-text"
                    style={{
                        maxWidth: "525px",
                        marginRight: "6%",
                        flex: 1,
                    }}
                >
                    <h1>Our Story</h1>
                    <p style={{ margin: "3rem 0" }}>
                        Launced in 2015, Exclusive is South Asia’s premier online shopping makterplace with an active presense in Bangladesh.
                        Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sallers and 300 brands
                        and serves 3 millioons customers across the region.
                    </p>
                    <p>
                        Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assotment in categories ranging from consumer.
                    </p>
                </Box>

                {/* Kép rész */}
                <Box
                    className="about-image-container"
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        maxWidth: "525px",
                        flex: 1,
                    }}
                >
                    <img
                        className="about-image"
                        src={AboutImg}
                        alt="aboutimg"
                        style={{
                            maxWidth: "525px",
                            borderRadius: "8px",
                        }}
                    />
                </Box>

                {/* Responsive design CSS */}
                <style jsx="true">{`
                .about-container {
                    display: flex;
                    flex-direction: row;
                }

                @media (max-width: 768px) {
                    .about-container {
                        flex-direction: column !important;
                        align-items: center !important;
                        text-align: center !important;
                    }

                    .about-image {
                        max-width: 90% !important;
                        margin: 1rem 0 !important;
                    }

                    .about-text h1 {
                        font-size: 1.8rem !important;
                    }

                    .about-text p {
                        font-size: 1rem !important;
                        margin: 1rem 0 !important;
                    }
                }
            `}</style>
            </Box>



        </>

    );
}

export default About;
