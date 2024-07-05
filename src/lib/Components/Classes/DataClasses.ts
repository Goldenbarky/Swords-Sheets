export class Calculation {
    protected variables:Variable[];
    public total:number;

    constructor() {
        this.variables = [];
        this.total = 0;
    }

    addVariables(variable:Variable) {
        this.variables.push(variable);
        this.total += Number(variable.bonus);
    }

    getVariables() {
        return [...this.variables];
    }

    join(old:Calculation) {
        old.getVariables().forEach(x => this.addVariables(x));
    }
}