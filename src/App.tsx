import { Flex, Text } from "rebass";
import { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import QRCode from "qrcode.react";
import { donationPost } from "./api/donationPost";
import { donationGet, Donation } from "./api/donationGet";

const App = () => {
  const [donation, setDonation] = useState<Donation>(null);
  const [name, setName] = useState<string>("");
  const [identifier, setIdentifier] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const createDonation = async () => {
    const payload = {
      name,
      identifier,
      comment,
      value: 1, // always 1 cent per now
    };
    const result = await donationPost(payload);

    console.log({
      result,
    });

    if (result.error) {
      setError(result.error);
      return;
    }

    setDonation(result);
  };

  const checkStatus = async () => {
    const result = await donationGet(donation.id);

    if (result.error) {
      setError(result.error);
      return;
    }

    setDonation(result);
  };

  console.log({
    donation,
  });

  const renderContent = () => {
    if (!donation) {
      return (
        <Flex
          flex={1}
          mt="20px"
          ml="20px"
          flexDirection={"column"}
          alignItems={"center"}
        >
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <TextField
            label="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button onClick={createDonation}>Donate</Button>
          {!!error && <Text>{error.toString()}</Text>}
        </Flex>
      );
    }

    return (
      <Flex
        flex={1}
        mt="20px"
        ml="20px"
        flexDirection="column"
        alignItems={"center"}
      >
        <Text>Pay Donation</Text>
        <QRCode
          size={200}
          renderAs={"svg"}
          value={donation.brCode}
          includeMargin={false}
        />
        <Button onClick={checkStatus}>Validate Donation</Button>
        <Text>Status: {donation.status}</Text>
      </Flex>
    );
  };

  return (
    <Flex flexDirection="column" alignItems={"center"}>
      <span>OpenPix Frontend Integration</span>
      {renderContent()}
    </Flex>
  );
};

export default App;
