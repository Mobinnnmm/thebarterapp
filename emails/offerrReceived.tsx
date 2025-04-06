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
  

  
  export default function ReceiveTradeOfferEmail() {
    return (
      <Html>
        <Head />
        <Preview>You have received Trade Offer!</Preview>
        <Tailwind>
          <Body className="bg-white font-sans">
            <Container className="mx-auto w-full max-w-[600px] p-0">
              <Section className="p-8 text-center">
                <Text className="mx-0 mb-8 mt-4 p-0 text-center text-2xl font-normal">
                  <span className="font-bold tracking-tighter">Trade Offer</span>
                </Text>
                <Text className="text-sm font-normal uppercase tracking-wider">
                   You have received a trade proposal from the username for the your following item. TODO
                </Text>
                <Heading className="my-4 text-4xl font-medium leading-tight">
                  TODO:
                </Heading>
                <Text className="mb-8 text-lg leading-8">
                   Receive user and item info as props and display them here
                </Text>
          
              </Section>

            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  }
