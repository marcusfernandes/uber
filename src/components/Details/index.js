import React from 'react';
import {View} from 'react-native';

import {
  Container,
  TypeTitle,
  TypeDescription,
  TypeImage,
  RequestButton,
  RequestButtonText,
} from './styles';

import uberx from '../../assets/uberx.png';

const Details = () => {
  return (
    <Container>
      <TypeTitle>Popular</TypeTitle>
      <TypeDescription>Viagens Baratas para o dia a dia</TypeDescription>
      <TypeImage source={uberx} />

      <TypeTitle>UberX</TypeTitle>
      <TypeDescription>R$ 6,00</TypeDescription>

      <RequestButton onPress={() => {}}>
        <RequestButtonText>Solicitar UberX</RequestButtonText>
      </RequestButton>
    </Container>
  );
};

export default Details;
