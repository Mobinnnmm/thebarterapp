import Trade from '@/models/Trade';
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

interface ReceiveTradeOfferEmailProps {
  proposedItem: TradeItem;
  targetItem: TradeItem;
  proposer: string;
  tradeID: string;
}

export default function ReceiveTradeOfferEmail({ 

  proposedItem,
  targetItem,
  proposer,
  tradeID
}: ReceiveTradeOfferEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You have received a Trade Offer from {proposer}!</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto w-full max-w-[600px] p-4 bg-white rounded-lg shadow">
            <Section className="p-6 text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-lg">
              <Heading className="text-black text-3xl font-bold">
                New Trade Offer
              </Heading>
              <Text className="text-gray text-lg">
                {proposer} wants to trade with you!
              </Text>
            </Section>

            <Section className="p-6">
              <Row>
                {/* Their Item */}
                <Column className="px-2">
                  <Section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <Text className="text-center font-bold text-gray-700">Their Item</Text>
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

                {/* Your Item */}
                <Column className="px-2">
                  <Section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <Text className="text-center font-bold text-gray-700">Your Item</Text>
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

            <Section className="p-6 text-center">
              <Text className="mb-4">
                Review this trade offer and respond by visiting your dashboard.
              </Text>
              <Link
                href={`thebarterapp.vercel.app/trade/view-trade?id=${tradeID}`}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-black py-3 px-6 rounded-lg font-medium no-underline inline-block"
              >
                View Trade Details
              </Link>
            </Section>

            <Hr className="border-gray-200 my-4" />
            
            <Section className="p-4 text-center">
              <Text className="text-gray-500 text-xs">
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
