import {BPSimData} from "./scenario/BPSimData";
import {Scenario} from "./scenario/Scenario";
import {ScenarioParameters} from "./scenario/ScenarioParameters";
import {TimeUnit} from "./scenario/TimeUnit";
import {VendorExtension} from "./scenario/VendorExtension";
import {Calendar} from "./calendar/Calendar";
import {
    BooleanParameter,
    ConstantParameter, DateTime, DateTimeParameter, Duration, DurationParameter,
    FloatingParameter,
    NumericParameter,
    StringParameter
} from "./parameter_type/ConstantParameter";
import {
    BetaDistribution,
    BinomialDistribution,
    DistributionParameter, ErlangDistribution, GammaDistribution,
    LogNormalDistribution, NegativeExponentialDistribution,
    NormalDistribution,
    PoissonDistribution,
    TriangularDistribution, TruncatedNormalDistribution,
    UniformDistribution, UserDistribution, UserDistributionDataPoint,
    WeibullDistribution
} from "./parameter_type/DistributionParameter";
import {EnumParameter} from "./parameter_type/EnumParameter";
import {ExpressionParameter} from "./parameter_type/ExpressionParameter";
import {Parameter} from "./parameter_type/Parameter";
import {ParameterValue} from "./parameter_type/ParameterValue";
import {ResultType} from "./parameter_type/ResultType";
import {ControlParameters} from "./parameters/ControlParameters";
import {CostParameters} from "./parameters/CostParameters";
import {ElementParameters} from "./parameters/ElementParameters";
import {PriorityParameters} from "./parameters/PriorityParameters";
import {Property} from "./parameters/Property";
import {PropertyType} from "./parameters/PropertyType";
import {ResourceParameters} from "./parameters/ResourceParameters";
import {TimeParameters} from "./parameters/TimeParameters";
import {PropertyParameters} from "./parameters/PropertyParameters";

export var factory = {
    "BPSimData": BPSimData,
    "Scenario": Scenario,
    "ScenarioParameters": ScenarioParameters,
    "TimeUnit": TimeUnit,
    "VendorExtension": VendorExtension,
    "Calendar": Calendar,
    "ConstantParameter": ConstantParameter,
    "StringParameter": StringParameter,
    "NumericParameter": NumericParameter,
    "FloatingParameter": FloatingParameter,
    "BooleanParameter": BooleanParameter,
    "DurationParameter": DurationParameter,
    "DateTimeParameter": DateTimeParameter,
    "DateTime": DateTime,
    "DistributionParameter": DistributionParameter,
    "BetaDistribution": BetaDistribution,
    "BinomialDistribution": BinomialDistribution,
    "WeibullDistribution": WeibullDistribution,
    "NormalDistribution": NormalDistribution,
    "LogNormalDistribution": LogNormalDistribution,
    "UniformDistribution": UniformDistribution,
    "TriangularDistribution": TriangularDistribution,
    "TruncatedNormalDistribution": TruncatedNormalDistribution,
    "PoissonDistribution": PoissonDistribution,
    "NegativeExponentialDistribution": NegativeExponentialDistribution,
    "ErlangDistribution": ErlangDistribution,
    "GammaDistribution": GammaDistribution,
    "UserDistribution": UserDistribution,
    "UserDistributionDataPoint": UserDistributionDataPoint,
    "EnumParameter": EnumParameter,
    "ExpressionParameter": ExpressionParameter,
    "Parameter": Parameter,
    "ParameterValue": ParameterValue,
    "ResultType": ResultType,
    "ControlParameters": ControlParameters,
    "CostParameters": CostParameters,
    "ElementParameters": ElementParameters,
    "PriorityParameters": PriorityParameters,
    "Property": Property,
    "PropertyParameters": PropertyParameters,
    "PropertyType": PropertyType,
    "ResourceParameters": ResourceParameters,
    "TimeParameters": TimeParameters,

    //non di classe i seguenti ma campi di classi
    "TriggerCount": Parameter,
    "InterTriggerTimer": Parameter,
    "Probability": Parameter,
    "Condition": Parameter,
    "ResultRequest": ResultType,
    "Start": Parameter,
    "Warmup": Parameter,
    "ElapsedTime": Parameter,
    "TransferTime": Parameter,
    "QueueTime": Parameter,
    "WaitTime": Parameter,
    "SetupTime": Parameter,
    "ProcessingTime": Parameter,
    "ValidationTime": Parameter,
    "ReworkTime": Parameter,
    "LagTime": Parameter,
    "Availability": Parameter,
    "Quantity": Parameter,
    "Selection": Parameter,
    "Role": Parameter,
    "Interruptible" : Parameter,
    "Priority": Parameter,
    "Type": PropertyType,
    "QueueLength": Parameter,
    "ResultTimeStamp": DateTime,
    "FixedCost": Parameter,
    "UnitCost": Parameter,
    

    //TODO vedere qui quale usare
    "Duration": Parameter
    // "Duration": Duration


}