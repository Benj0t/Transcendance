import { toast } from 'react-toastify';

export const notifyToasterSuccess = (message: string, autoClose = 2500): void => {
  toast.success(message, {
    autoClose,
  });
};

export const notifyToasterInfo = (message: string, autoClose = 2500): void => {
  toast.info(message, {
    autoClose,
  });
};

export const notifyToasterError = (message: string, autoClose = 2500): void => {
  toast.error(message, {
    autoClose,
  });
};

export const NotifyToasterInvitation = (
  message: string,
  arg: number,
  acceptGame: (arg: number) => void,
): void => {
  toast.info(message, {
    onClick: () => {
      acceptGame(arg);
    },
  });
};
