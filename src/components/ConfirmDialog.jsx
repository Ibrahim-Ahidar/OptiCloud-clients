import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const ConfirmDialog = memo(({
  open, title, message, onConfirm, onCancel, confirmText, loading = false,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>{t('common.cancel')}</Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
          {confirmText || t('common.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

ConfirmDialog.displayName = 'ConfirmDialog';
export default ConfirmDialog;
