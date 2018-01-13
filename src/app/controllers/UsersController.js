/**
 *          .::USER CONTROLLER::.
 * All related operations to User belong here. 
 * 
 */
import User from '../models/User';
import Verification from '../models/related/Verification'
import tokenize from '../middlewares/Token'
import kavenegar from 'kavenegar'

/*          POST /api/users/register            */
export let register = async(req, res, next) => {
    //REQUEST VALIDATION
    if (!req.validate(["username", "password"])) return;

    var {
        username,
        password
    } = req.body;
    //CREATING NEW USER OBJECT
    var newUser = new User({
        username,
        password
    });
    try {
        //SAVING USER
        var savedUser = await newUser.save();
        //GENERATING TOKEN
        var token = await tokenize(savedUser._id);

        //OK RESPONSE
        res.validSend(200, {
            registered: true,
            message: "User has been registered successfully.",
            token: token
        });
    } catch (e) {
        //FAILURE RESPONSE
        res.validSend(500, {
            error: JSON.stringify(e)
        });
    }

}
/*          POST /api/users/login            */
export let login = async(req, res, next) => {
    //REQUEST VALIDATION    
    if (!req.validate(["phone"])) return;

    var {
        phone,

    } = req.body;
    try {
        //FINDING USER OR CREATING HIM
        var user = await User.findOneAndUpdate({
            phone
        }, {
            phone
        }, {
            new: true,
            upsert: true
        });
        var expireOn = moment().add(4, 'hours').format("x");
        console.log(expireOn)
        //CREATING VERIFICATION CODE
        var newVerification = new Verification({
            user,
            code: Math.floor(100000 + Math.random() * 900000),
            expireOn
        })
        var verification = await newVerification.save();
        //SENDING SMS 
        var response = await request.get({

            url: "https://api.kavenegar.com/v1/" + process.env.KAVENEGAR + "/verify/lookup.json?receptor=" + user.phone + "&token=" + verification.code + "&template=gofind",

        });
        response = JSON.parse(response);
        //GENERATING TOKEN
        // var token = await tokenize(user._id);
        if (!response) throw "SMS didn't send.1";
        if (!response.return) throw "SMS didn't send.2";
        if (response.return.status != "200") throw "SMS didn't send.3>" + response.return.status;


        //OK RESPONSE
        res.validSend(200, {
            message: "verification code sent."
        })

    } catch (e) {
        //FAILURE RESPONSE
        console.error(e)
        res.validSend(500, {
            error: e
        })
    }
}
/*          POST /api/users/verify/phone            */
export let verifyPhone = async(req, res, next) => {
    //REQUEST VALIDATION    
    if (!req.validate(["phone", "code"])) return;

    var {
        phone,
        code
    } = req.body;
    try {
        var user = await User.findOne({
            phone
        });

        var verification = await Verification.findOneAndUpdate({
            user: user._id,
            code,
            expireOn: {
                $lte: Date.now()
            }
        },{expiredAt:Date.now()});

        if(verification.length<=0)

    } catch (e) {
        //FAILURE RESPONSE
        console.error(e)
        res.validSend(500, {
            error: e
        })
    }
}
/*          POST /api/users/me            */
export let me = async(req, res) => {
    //OK RESPONSE
    res.validSend(200, {
        test: "req.User"
    });
}