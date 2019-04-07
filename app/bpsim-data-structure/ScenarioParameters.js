class ScenarioParameters {
    constructor(start, duration, warmup, replication = 1, seed, baseTimeUnit = timeunits.MINUTES,
                baseCurrencyUnit = "USD", baseResultFrequency, baseResultFrequencyCumul = false,
                traceOutput = false, traceFormat = "XES"){

        this._start = start;
        this._duration = duration;
        this._warmup = warmup;
        this._replication = replication;
        this._seed = seed;
        this._baseTimeUnit = baseTimeUnit;
        this._baseCurrencyUnit = baseCurrencyUnit;
        this._baseResultFrequency = baseResultFrequency;
        this._baseResultFrequencyCumul = baseResultFrequencyCumul;
        this._traceOutput = traceOutput;
        this._traceFormat = traceFormat;
    }

    get start() {
        return this._start;
    }

    set start(value) {
        this._start = value;
    }

    get duration() {
        return this._duration;
    }

    set duration(value) {
        this._duration = value;
    }

    get warmup() {
        return this._warmup;
    }

    set warmup(value) {
        this._warmup = value;
    }

    get replication() {
        return this._replication;
    }

    set replication(value) {
        this._replication = value;
    }

    get seed() {
        return this._seed;
    }

    set seed(value) {
        this._seed = value;
    }

    get baseTimeUnit() {
        return this._baseTimeUnit;
    }

    set baseTimeUnit(value) {
        this._baseTimeUnit = value;
    }

    get baseCurrencyUnit() {
        return this._baseCurrencyUnit;
    }

    set baseCurrencyUnit(value) {
        this._baseCurrencyUnit = value;
    }

    get baseResultFrequency() {
        return this._baseResultFrequency;
    }

    set baseResultFrequency(value) {
        this._baseResultFrequency = value;
    }

    get baseResultFrequencyCumul() {
        return this._baseResultFrequencyCumul;
    }

    set baseResultFrequencyCumul(value) {
        this._baseResultFrequencyCumul = value;
    }

    get traceOutput() {
        return this._traceOutput;
    }

    set traceOutput(value) {
        this._traceOutput = value;
    }

    get traceFormat() {
        return this._traceFormat;
    }

    set traceFormat(value) {
        this._traceFormat = value;
    }
}