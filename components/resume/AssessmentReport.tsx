'use client';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1a365d',
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 10,
    color: '#2d3748',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
    paddingBottom: 3,
  },
  skillContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  skillName: {
    fontSize: 12,
    flex: 1,
  },
  skillRating: {
    fontSize: 12,
    width: 30,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 5,
  },
  scoreContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  scoreLabel: {
    fontSize: 12,
    flex: 1,
  },
  scoreValue: {
    fontSize: 12,
    width: 50,
  },
  careerMatchContainer: {
    marginBottom: 8,
  },
  careerMatch: {
    fontSize: 12,
    color: '#4a5568',
  },
  confidenceBar: {
    height: 10,
    backgroundColor: '#e2e8f0',
    marginTop: 2,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#4299e1',
  },
});

interface AssessmentReportProps {
  data: any;
}

const AssessmentReport = ({ data }: AssessmentReportProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Skills Assessment Report</Text>
        </View>

        {/* Technical Skills Section */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>
            Technical Skills & Self-Rating
          </Text>
          {Object.entries(data.self_ratings_json).map(
            ([skill, rating]) => (
              <View key={skill} style={styles.skillContainer}>
                <Text style={styles.skillName}>{skill}</Text>
                <Text style={styles.skillRating}>{rating}/5</Text>
              </View>
            )
          )}
        </View>

        {/* SFIA Assessment Results */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>
            SFIA Assessment Results
          </Text>
          {Object.entries(data.sfia1_results.scores).map(
            ([level, score]: [string, any]) => (
              <View key={level} style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>
                  Level {score.level}
                </Text>
                <Text style={styles.scoreValue}>
                  {score.percentage}%
                </Text>
              </View>
            )
          )}
        </View>

        {/* Career Matches */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Top Career Matches</Text>
          {data.sfia1_results.sortedCareerKeys
            .slice(0, 5)
            .map((career: string, index: number) => (
              <View key={career} style={styles.careerMatchContainer}>
                <Text style={styles.careerMatch}>
                  {index + 1}. {career} -{' '}
                  {data.sfia1_results.sortedCareerConfidences[
                    index
                  ].toFixed(1)}
                  %
                </Text>
                <View style={styles.confidenceBar}>
                  <View
                    style={[
                      styles.confidenceFill,
                      {
                        width: `${data.sfia1_results.sortedCareerConfidences[index]}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
        </View>

        {/* RIASEC Results */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>RIASEC Assessment</Text>
          {Object.entries(data.raisec_results.scores).map(
            ([type, score]) => (
              <View key={type} style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>{type}</Text>
                <Text style={styles.scoreValue}>{score}</Text>
              </View>
            )
          )}
        </View>

        {/* Technical Assessment Summary */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Technical Assessment</Text>
          <Text style={styles.listItem}>
            Overall Technical Score: {data.technical_score}/10
          </Text>
          <Text style={styles.listItem}>
            MCQ Score: {data.technical_score_mcq}
          </Text>
          <Text style={styles.listItem}>
            Open-ended Score: {data.technical_score_open}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default AssessmentReport;
