const ReferalCard = ({ updatedUserData }: any) => {
  return (
    <div className="main-border w-full px-2 py-2 rounded-lg">
      {/* <div className="refer"></div> */}
      {/* <div className="flex justify-between px-3 py-3 referal-link-box active items-center">
        <p className="text-sm">Your Referal Link</p>
      </div> */}
      <div className="flex justify-between px-2 py-2 referal-link-box items-center mt-0.2">
        <p className="text-sm">TOTAL TRADES</p>
        <p className="text-xs">{updatedUserData.trades}</p>
      </div>
      <div className="flex justify-between px-2 py-2 referal-link-box items-center mt-0.1">
        <p className="text-sm">LIFETIME WINS</p>
        <p className="text-xs">{updatedUserData.lifetimeWin}</p>
      </div>
    </div>
  );
};

export default ReferalCard;
