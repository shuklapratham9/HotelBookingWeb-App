const usermodel = require('../models/usermodel')
const roommodel = require('../models/roommodel')
const hotelmodel = require('../models/hotelmodel')
const sendMail = require('../middlewares/emailservice')
exports.cancelbooking = async (req,res)=>{
    if(req.user)
    { 
        const user = await usermodel.findById(req.user._id);
        console.log(req.user, 'this is in cancel booking function')
        console.log(user)
        if(user.currentlyBookedRoom)
        {
            try{
            let roomid = user.currentlyBookedRoom
            let room = await roommodel.updateOne({_id:roomid},{bookingDates:{from:null,to:null}});
            await usermodel.updateOne({_id:req.user},{currentlyBookedRoom:null,currentHotel:null,bookingDates:{
                from:null,
                to:null
            }})
            await sendMail(user.email,`Your booking has been cancelled thanks for doing buiseness with use `)
            res.status(200).json({message:'cancelled sucessfully'})
        }
            catch(err)
            {
                res.status(500).json({message:'an error occured'});
            }

        }
        else{
            res.status(404).json({message:'you do not have any booking'})
        }
    }
    else{
        res.status(401).json({message:"you are not authorized"})
    }
}

exports.lastbooking = async (req, res) => {
    try {
        if (req.user) {
            let user = await usermodel.findById(req.user._id);
            if (user) {
                if (user.currentlyBookedRoom) {
                    const currentHotel = await hotelmodel.findById(user.currentHotel);
                    // console.log(currentHotel)
                    user.name = currentHotel.name;
            
                    console.log(user)
                    return res.status(200).json(user); 
                } else {
                    return res.status(404).json({ message: 'No booking found' }); 
                }
            }
        }
        return res.status(404).json({ message: 'User not found' });
    } catch (err) {
        console.error(err); 
        return res.status(500).json({ message: 'An unexpected error has occurred' });
    }
};
