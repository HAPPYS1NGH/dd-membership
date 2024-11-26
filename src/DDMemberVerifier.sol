// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {DDMemberProver} from "./DDMemberProver.sol";

contract DDMemberVerifier is Verifier {
    address public prover;

    constructor(address _prover) {
        prover = _prover;
    }

    function verifyDDMembership(Proof calldata, address claimer, bool wasMember)
        public
        view
        onlyVerified(prover, DDMemberProver.checkDDMembership.selector)
        returns (bool)
    {
        return wasMember;
    }
}
