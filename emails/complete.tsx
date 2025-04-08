import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

// Define types for the props
interface TradeItem {
  _id: string;
  title: string;
  description: string;
  images?: string[];
}

interface CompletedTradeEmailProps {
  proposedItem: TradeItem;
  targetItem: TradeItem;
  proposer: string;
  recipient: string;
  tradeID: string;
  meetingDetails?: {
    date?: string;
    time?: string;
    location?: string;
    instructions?: string;
  };
}

export default function CompletedTradeEmail({ 
  proposedItem,
  targetItem,
  proposer,
  recipient,
  tradeID,
  meetingDetails
}: CompletedTradeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Trade with {proposer === recipient ? proposer : recipient} has been completed!</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto w-full max-w-[600px] p-4 bg-white rounded-lg shadow">
            <Section className="p-6 text-center bg-gradient-to-r from-green-500 to-teal-500 rounded-t-lg">
              <Heading className="text-black text-3xl font-bold">
                Trade Completed!
              </Heading>
              <Text className="text-gray text-lg">
                Your trade with {proposer === recipient ? proposer : recipient} has been finalized
              </Text>
            </Section>

            <Section className="p-6">
              <Row>
                {/* First Item */}
                <Column className="px-2">
                  <Section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <Text className="text-center font-bold text-gray-700">Item 1</Text>
                    <Img
                      src={proposedItem?.images?.[0] || "https://via.placeholder.com/300?text=No+Image"}
                      alt={proposedItem?.title}
                      width="100%"
                      height="auto"
                      className="rounded-lg"
                    />
                    <Heading className="text-xl font-medium mt-4 mb-2">
                      {proposedItem?.title || "Item Title"}
                    </Heading>
                    <Text className="text-gray-600 text-sm">
                      {proposedItem?.description?.substring(0, 100) || "No description"}
                      {proposedItem?.description?.length > 100 ? "..." : ""}
                    </Text>
                  </Section>
                </Column>

                {/* Second Item */}
                <Column className="px-2">
                  <Section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <Text className="text-center font-bold text-gray-700">Item 2</Text>
                    <Img
                      src={targetItem?.images?.[0] || "https://via.placeholder.com/300?text=No+Image"}
                      alt={targetItem?.title}
                      width="100%"
                      height="auto"
                      className="rounded-lg"
                    />
                    <Heading className="text-xl font-medium mt-4 mb-2">
                      {targetItem?.title || "Item Title"}
                    </Heading>
                    <Text className="text-gray-600 text-sm">
                      {targetItem?.description?.substring(0, 100) || "No description"}
                      {targetItem?.description?.length > 100 ? "..." : ""}
                    </Text>
                  </Section>
                </Column>
              </Row>
            </Section>

            {meetingDetails && (
              <Section className="p-6 bg-gray-50 rounded-lg border border-gray-200 my-4">
                <Heading className="text-xl font-medium mb-4">Meeting Details</Heading>
                {meetingDetails.date && (
                  <Text className="text-gray-700">
                    <strong>Date:</strong> {meetingDetails.date} {meetingDetails.time ? `at ${meetingDetails.time}` : ''}
                  </Text>
                )}
                {meetingDetails.location && (
                  <Text className="text-gray-700">
                    <strong>Location:</strong> {meetingDetails.location}
                  </Text>
                )}
                {meetingDetails.instructions && (
                  <Text className="text-gray-700">
                    <strong>Instructions:</strong> {meetingDetails.instructions}
                  </Text>
                )}
              </Section>
            )}

            <Section className="p-6 text-center">
              <Link
                href={`thebarterapp.vercel.app/trade/view-trade?id=${tradeID}`}
                className="bg-gradient-to-r from-green-500 to-teal-500 text-black py-3 px-6 rounded-lg font-medium no-underline inline-block"
              >
                View Trade Details
              </Link>
            </Section>

            <Hr className="border-gray-200 my-4" />
            
            <Section className="p-4 text-center">
              <Text className="text-gray-500 text-xs">
                Thank you for using Barter!
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
