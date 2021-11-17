import Modal from "../UI/Modal";
import './SurveyLink.css';
import copyIcon from '../media/copy1.png';
import QRCode from "qrcode.react";

const SurveyLink = (props) => { 
    
    const link = `http://localhost:3000/survey/${props.surveyID}`;
    
    const copyLinkHandler = () => {
        const tempInput = document.createElement('input')
        tempInput.value = link; 
        document.body.appendChild(tempInput)
        tempInput.select()
        document.execCommand('copy')
        document.body.removeChild(tempInput)
    }

    const downloadQRCodeHandler = () => {
        const qrCodeURL = document.getElementById('QRcode')
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        let aEl = document.createElement("a");
        aEl.href = qrCodeURL;
        aEl.download = "QR_Code.png";
        document.body.appendChild(aEl);
        aEl.click();
        document.body.removeChild(aEl);
    };


    
    return(
        <Modal onClose={props.onClose}>
            <div>
                <p>Copy this url and send to your customers.</p>
                <p className='survey-link'>
                    <span id='survey-url'>{link}</span>
                    <span className='copy' onClick={copyLinkHandler}>
                        <img src={copyIcon} alt='Copy' width='25'/>
                    </span>
                </p>
                <div className='qr-code'>
                    <QRCode id='QRcode' value={link} size={256}/>
                </div>
                <div className='download'><button onClick={downloadQRCodeHandler}>Download QRCode</button></div>
                
            </div>
        </Modal>
    )
};

export default SurveyLink;