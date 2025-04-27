const SEB_FILE_EXTENSIONS = [".seb", ".SEB", ".Seb", ".sEB", ".seB"];

const SEB_FILE_MIME_TYPES = ["application/octet-stream", "application/seb"];

const CONTACT_FILE_EXTENSIONS = [".pdf", ".PDF", ".png", ".PNG", ".jpg", ".JPG", ".jpeg", ".JPEG"];

const CONTACT_FILE_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg"];

const FILE_EXTENSIONS = {
  contact: {
    extensions: CONTACT_FILE_EXTENSIONS,
    mimeTypes: CONTACT_FILE_MIME_TYPES,
  },
  seb: {
    extensions: SEB_FILE_EXTENSIONS,
    mimeTypes: SEB_FILE_MIME_TYPES,
  },
};

export default FILE_EXTENSIONS;
