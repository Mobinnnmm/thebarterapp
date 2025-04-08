import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
  } from '@react-email/components';

  // Defining the types for the props

  interface ReceiveTradeAcceptEmailProps {
    proposedItem: string,
    targetItem: string,
    tradeID: string
  }
  

  
  export default function AcceptEmail({
    proposedItem, targetItem, tradeID
  }: ReceiveTradeAcceptEmailProps){
    return (
      <Html>
        <Head />
        <Preview>Your Trade Offer has been Accepted!</Preview>
        <Tailwind>
          <Body className="bg-white font-sans">
            <Container className="mx-auto w-full max-w-[600px] p-0">
              <Section className="p-8 text-center">
                <Text className="mx-0 mb-8 mt-4 p-0 text-center text-2xl font-normal">
                  <span className="font-bold tracking-tighter">Trade Offer Accepted</span>
                </Text>
                <Text className="text-sm font-normal uppercase tracking-wider">
                   Your trade proposal to {proposedItem} with {targetItem} has been accepted.
                </Text>
                <Heading className="my-4 text-4xl font-medium leading-tight">
        
                </Heading>
                <Text className="mb-8 text-lg leading-8">
                   Receive user and item info as props and display them here
                </Text>
          
              </Section>

              <Section className="p-6 text-center">
              <Text className="mb-4">
                Review this trade offer and respond by visiting your dashboard.
              </Text>
              <Link
                href={`thebarterapp.vercel.app//trade/negotiate/${tradeID}`}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-black py-3 px-6 rounded-lg font-medium no-underline inline-block"
              >
                View Trade Details
              </Link>
            </Section>

            <Hr className="border-gray-200 my-4" />

            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  }
