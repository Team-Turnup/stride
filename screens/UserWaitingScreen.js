import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import useInterval from 'use-interval'
import {
  Container,
  Button,
  Text,
  Header,
  Content,
  Body,
  ListItem,
  CheckBox,
  View
} from 'native-base'
import {StartTime, styles} from './WaitingScreenComponents'
import RoutineBarDisplay from '../components/RoutineBarDisplay'
import {leaveClass} from '../store/singleClass'
import {SocketContext} from '../socket'

const UserWaitingScreen = ({navigation, socket}) => {
  // get user from store
  const user = useSelector(({user}) => user)
  // get dummy data for class right now
  const {attendees, when, name, ..._class} = useSelector(
    ({singleClass}) => singleClass
  )
  const routine = useSelector(({routine}) => routine)

  const dispatch = useDispatch()
  const [curTime, setCurTime] = useState(Date.now())

  useEffect(() => {
    socket.emit('subscribe', _class.id, user.id)
    return () => socket.emit('unsubscribe', _class.id, user.id)
  }, [])

  useInterval(() => setCurTime(Date.now()), 1000)

  return (
    <Container>
      <Header>
        <Text style={{fontWeight: 'bold'}}>{name}</Text>
      </Header>
      <Content>
        <View style={styles.startView}>
          {when < curTime ? (
            <Text>Waiting for Trainer</Text>
          ) : (
            <StartTime when={when} />
          )}
        </View>
        {routine && routine.intervals && routine.intervals.length ? (
          <RoutineBarDisplay routine={routine.intervals} />
        ) : (
          <Text>Loading Routine</Text>
        )}
        <Button
          block
          danger
          style={{margin: 7}}
          onPress={() => {
            dispatch(leaveClass(_class.id, user.id))
            navigation.navigate('HomeClassesScreen')
          }}
        >
          <Text>Leave Class</Text>
        </Button>
      </Content>
    </Container>
  )
}

export default props => (
  <SocketContext.Consumer>
    {socket => <UserWaitingScreen {...props} socket={socket} />}
  </SocketContext.Consumer>
)
