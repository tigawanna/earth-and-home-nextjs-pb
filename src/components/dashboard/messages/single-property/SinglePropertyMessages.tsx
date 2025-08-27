interface SinglePropertyMessagesProps {
  propertyId: string;
}

export default function SinglePropertyMessages({  propertyId}: SinglePropertyMessagesProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
        SinglePropertyMessages {propertyId}
    </div>
  );
}
