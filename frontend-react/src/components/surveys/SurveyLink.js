import { useContext } from "react";
import Modal from "../../UI/Modal";
import classes from './SurveyLink.module.css';
import copyIcon from '../../media/copy1.png';
import QRCode from "qrcode.react";
import EndpointContext from '../../store/api-endpoint';


const SurveyLink = (props) => { 
    const url = useContext(EndpointContext);

    const link = `${url.endpoint}/survey/${props.surveyID}`;
    
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
                <p className={classes.surveyLink}>
                    <span id='survey-url'>{link}</span>
                    <span className={classes.copy} onClick={copyLinkHandler}>
                        <img src={copyIcon} alt='Copy' width='25'/>
                    </span>
                </p>
                <div className={classes.qrCode} id='download-area'>
                    <QRCode className={classes.QRCode} id='QRcode' 
                    value={link} fgColor='rgb(0, 0, 60)' includeMargin={true} size={300}/>
                </div>
                <div className={classes.download}><button onClick={downloadQRCodeHandler}>Download QRCode</button></div>
                
            </div>
        </Modal>
    )
};

export default SurveyLink;