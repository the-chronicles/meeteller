/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/paystack.ts

export const payWithPaystack = ({
  email,
  amount,
  onSuccess,
  onClose,
}: {
  email: string;
  amount: number;
  onSuccess: () => void;
  onClose?: () => void;
}) => {
  const handler = (window as any).PaystackPop.setup({
    key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
    email,
    amount, // in kobo
    currency: "NGN",

    callback: function () {
      onSuccess();
    },

    onClose: function () {
      onClose?.();
    },
  });

  handler.openIframe();
};
