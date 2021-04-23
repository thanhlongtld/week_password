const express = require("express")
const formidable = require("formidable")
const nodemailer = require("nodemailer")

const app = express()

app.use(express.json())

app.set("views", "/")

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html")
})
app.get("/forgot_password", (req, res) => {
    res.sendFile(__dirname + "/forgot.html")
})
app.post("/forgot_password", (req, res) => {
    const form = formidable({ multiples: true })
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.send(err)
        }
        const { email } = fields
        console.log(email)
        const { host } = req.headers

        const url = `${host}/reset_password?token=1234`

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: false,
            auth: {
                user: "vantamdo0806@gmail.com",
                pass: "dovantam123"
            }
        })

        const mailOptions = {
            from: "vantamdo0806@gmail.com",
            to: email,
            subject: "Bạn vừa yêu cầu đổi mật khẩu 2",
            html: `<h1>Click vào link sau để thay đổi mật khẩu của bạn: </h1><a href="http://${url}">${url}</a>`
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log("Email sent: " + info.response)
            }
        })

        res.json({ fields, files })
    })
})

app.get("/reset_password", (req, res) => {
    const { token } = req.query
    if (!token || token !== "1234") {
        return res.send("wrong token")
    }
    res.sendFile(__dirname + "/reset.html")
})

app.listen(5001, () => {
    console.log("listen on port 5001")
})
