import * as functions from 'firebase-functions';
import Axios from 'axios';

export const verifyGRecaptchaToken = functions.https.onRequest(async (req, res) => {
  const { secret } = functions.config().recaptcha;
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
  }
  
  const { token }: { token: string } = req.body;
  
  try {
    const payload = await Axios.post('https://www.google.com/recaptcha/api/siteverify', null, { params: { secret, response: token } });
    const { config, data } = payload;
    const configData = config.data;
    
    res.status(200).send({ configData, data });
  } catch (e) {
    res.status(500).send(`${e}`);
  }
});
