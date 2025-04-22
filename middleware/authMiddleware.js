import admin from 'firebase-admin';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.app();
}

const authenticateFirebase = async (req, res, next) => {
   const authHeader = req.headers.authorization;
   const token = authHeader?.split(' ')[1];
  
   if (!token) return res.status(401).json({ message: 'No token provided' });
  
   try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;             
      req.firebaseUID = decodedToken.uid;   
      next();
   } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(403).json({ message: 'Unauthorized' });
}
};
  

export default authenticateFirebase;
