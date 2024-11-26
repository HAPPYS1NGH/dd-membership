// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {VTest} from "vlayer-0.1.0/testing/VTest.sol";
import {DDMemberProver} from "../src//DDMemberProver.sol";
import {DDMemberVerifier} from "../src//DDMemberVerifier.sol";

contract DDMemberTest is VTest {
    DDMemberProver public prover;
    DDMemberVerifier public verifier;

    function setUp() public {
        prover = new DDMemberProver(19117727);
        verifier = new DDMemberVerifier(address(prover));
    }

    function test_CheckDDMembership() public {
        bool result = verifier.verifyDDMembership(getProof(), address(this), true);
        assert(result);
    }

    // Counter public counter;

    // function setUp() public {
    //     counter = new Counter();
    //     counter.setNumber(0);
    // }

    // function test_Increment() public {
    //     counter.increment();
    //     assertEq(counter.number(), 1);
    // }

    // function testFuzz_SetNumber(uint256 x) public {
    //     counter.setNumber(x);
    //     assertEq(counter.number(), x);
    // }
}
