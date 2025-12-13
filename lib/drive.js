import { google } from 'googleapis';
import { Buffer } from 'node:buffer';

const CREDENTIALS = JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS, 'base64').toString('utf-8'));
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  credentials: CREDENTIALS,
  scopes: SCOPES,
});

const drive = google.drive({
  version: 'v3',
  auth,
});

export const getFileUrl = async (fileId) => {
  try {
    const response = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink, webContentLink',
    });
    return response.data.webContentLink || response.data.webViewLink;
  } catch (error) {
    console.error('Error getting file URL:', error);
    return null;
  }
};

export const getFileMetadata = async (fileId) => {
  try {
    const response = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType, size, createdTime',
    });
    return response.data;
  } catch (error) {
    console.error('Error getting file metadata:', error);
    return null;
  }
};

export const shareFileWithUser = async (fileId, userEmail) => {
  try {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        type: 'user',
        role: 'reader',
        emailAddress: userEmail,
      },
    });
    return true;
  } catch (error) {
    console.error('Error sharing file:', error);
    return false;
  }
};

export default drive;