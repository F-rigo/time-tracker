import { StyleSheet } from 'react-native';

const ReportScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  recordRow: {
    marginBottom: 20,
  },
  dateText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    marginLeft: 10,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReportScreenStyles;
