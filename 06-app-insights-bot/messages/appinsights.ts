import * as applicationinsights from 'applicationinsights';
import { Session } from 'botbuilder';
import * as _ from 'lodash';

class AppInsights {
    public setup() {
        applicationinsights.setup(process.env.APPINSIGHTS_INSTRUMENTATION_KEY)
            .setAutoDependencyCorrelation(true)
            .setAutoCollectRequests(true)
            .setAutoCollectPerformance(true)
            .setAutoCollectExceptions(true)
            .setAutoCollectDependencies(true)
            .setAutoCollectConsole(true)
            .setUseDiskRetryCaching(true)
            .start();
    }

    public log(name: string, session: Session, args: any) {

        // APPINSIGHT: put bot session and LUIS results into single object
        const data = {...session.message, ...args};

        // APPINSIGHT: Flatten data into name/value pairs
        const flatten = (x: any, result: any, prefix: any) => {
            if (_.isObject(x)) {
                _.each(x, (v, k) => {
                    flatten(v, result, prefix ? prefix + '_' + k : k)
                })
            } else {
                result[prefix] = x
            }
            return result;
        }

        // APPINSIGHT: call fn to flatten data
        const flattenedData = flatten(data, {}, null);

        // APPINSIGHT: send data to Application Insights
        applicationinsights.defaultClient.trackEvent({ name, properties: flattenedData });
    }
}
const appInsights = new AppInsights();
export { appInsights as BotAppInsights }