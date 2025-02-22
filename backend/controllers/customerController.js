const bcrypt = require('bcrypt');
const Customer = require('../models/customerSchema.js');
const { createNewToken } = require('../utils/token.js');
const nodemailer = require('nodemailer');

const customerRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const customer = new Customer({
            ...req.body,
            password: hashedPass
        });

        const existingcustomerByEmail = await Customer.findOne({ email: req.body.email });

        if (existingcustomerByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else {
            let result = await customer.save();
            result.password = undefined;
            
            const token = createNewToken(result._id)

            result = {
                ...result._doc,
                token: token
            };

            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const customerLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let customer = await Customer.findOne({ email: req.body.email });
        if (customer) {
            const validated = await bcrypt.compare(req.body.password, customer.password);
            if (validated) {
                customer.password = undefined;

                const token = createNewToken(customer._id)

                customer = {
                    ...customer._doc,
                    token: token
                };

                res.send(customer);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};

const getCartDetail = async (req, res) => {
    try {
        let customer = await Customer.findById(req.params.id)
        if (customer) {
            res.send(customer.cartDetails);
        }
        else {
            res.send({ message: "No customer found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const cartUpdate = async (req, res) => {
    try {

        let customer = await Customer.findByIdAndUpdate(req.params.id, req.body,
            { new: true })

        return res.send(customer.cartDetails);

    } catch (err) {
        res.status(500).json(err);
    }
}

const nodemail = async (req, res) => {
    const nodemailer = require('nodemailer');


    // SMTP transporter létrehozása Gmail-hez
    var transporter = nodemailer.createTransport({
        service: "gmail", // Gmail szolgáltatás
        auth: {
            user: "veresricsi150@gmail.com", // A saját Outlook címed
            pass: "ftvz vhea fxeh bfyh" //alkalmazásjelszó            
        }
    });

    // E-mail opciók beállítása
    const mailOptions = {
        from: req.body.email,   // Küldő e-mail címe
        to: 'veresricsi116@gmail.com',   // Címzett e-mail címe
        subject: req.body.subject,         // Tárgy
        text: req.body.text // Tartalom
    };

    // E-mail elküldése
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Hiba történt:', error);
        } else {
            console.log('E-mail elküldve:', info.response);
        }
    });

};

module.exports = {
    customerRegister,
    customerLogIn,
    getCartDetail,
    cartUpdate,
    nodemail,
};
